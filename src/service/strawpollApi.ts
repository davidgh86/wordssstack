import { Http } from '@capacitor-community/http';

class Strawpoll {

    private static instance: Strawpoll;


    public static getInstance(): Strawpoll {
        if (!Strawpoll.instance) {
            Strawpoll.instance = new Strawpoll()
        }
        
        return Strawpoll.instance
    }

    private getOption(option: string) {
        return {
            type: "text",
            value: option
        }
    }

    private getOptions(options: Array<string>) {
        return options.map(opt => this.getOption(opt))
    }

    public async createPoll(title: string, opts: Array<string>):Promise<any> {

        const body = {
            title: title,
            poll_config: {
                  allow_comments: false,
                  allow_indeterminate: false,
                  allow_other_option: false,
                  allow_vpn_users: false,
                  deadline_at: null,
                  duplication_checking: "ip",
                  edit_vote_permissions: "nobody",
                  force_appearance: null,
                  hide_participants: false,
                  is_multiple_choice: false,
                  is_private: true,
                  layout: null,
                  randomize_options: false,
                  require_voter_account: false,
                  require_voter_names: false,
                  results_visibility: "always",
                  show_write_in_options: false,
                  vote_type: "default"
              },
              
              poll_options: this.getOptions(opts),
            type: "multiple_choice"
          }

        const options = {
            url: `https://api.strawpoll.com/v3/polls`,
            data: body
        };
        
        const response = await Http.post(options)
        return {
            embed_url : response.data.embed_url,
            id: response.data.id,
        }
    }

}

export default Strawpoll.getInstance()